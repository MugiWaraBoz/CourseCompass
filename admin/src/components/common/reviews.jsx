import { ArrowLeft, MessageSquareText, Pencil, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getAllStudentReviews,
    getAllCourseReviews,
    getAllFacultyReviews,
    deleteReview,
    patchReview,
} from '@/api/reviewApi';

import { getCourseInfo } from '@/api/courseApi';
import { getFacultyInfo } from '@/api/facultyApi';
import { getStudentInfo } from '@/api/studentApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toast } from '@/components/Toast';

// Reviews always carry a student, a course, and a faculty. Whichever one this
// page is already scoped to (via `type`/`id`) is left out of each card's meta
// row, and the other two are resolved to names and shown instead.
const OTHER_ENTITIES = {
    student: ['course', 'faculty'],
    course: ['student', 'faculty'],
    faculty: ['student', 'course'],
};

const ENTITY_CONFIG = {
    student: { getInfo: getStudentInfo, idKey: 'studentId', nounLabel: 'Student' },
    course: { getInfo: getCourseInfo, idKey: 'courseId', nounLabel: 'Course' },
    faculty: { getInfo: getFacultyInfo, idKey: 'facultyId', nounLabel: 'Faculty' },
};

// Entity info responses aren't guaranteed to use the same field name, so try
// the common candidates before falling back.
function extractName(entity) {
    if (!entity) return null;
    return (
        entity.name ||
        entity.fullName ||
        entity.title ||
        entity.courseName ||
        entity.facultyName ||
        entity.studentName ||
        null
    );
}

function getEntityId(review, entityType) {
    const { idKey } = ENTITY_CONFIG[entityType];
    if (review[idKey]) return String(review[idKey]);
    const nested = review[entityType];
    if (nested && typeof nested === 'object') return nested._id ? String(nested._id) : null;
    if (typeof nested === 'string') return nested;
    return null;
}

function Reviews({ id, type }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    const [subjectName, setSubjectName] = useState(null);
    const [entityNames, setEntityNames] = useState({}); // `${entityType}:${id}` -> name

    // Edit dialog state
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ rating: '', difficultyRating: '', semester: '', comment: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Delete dialog state
    const [deletingReview, setDeletingReview] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const navigate = useNavigate();

    const otherEntities = OTHER_ENTITIES[type] || [];

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                let reviewsData;
                if (type === 'student') {
                    reviewsData = await getAllStudentReviews(id);
                } else if (type === 'course') {
                    reviewsData = await getAllCourseReviews(id);
                } else if (type === 'faculty') {
                    reviewsData = await getAllFacultyReviews(id);
                } else {
                    setReviews([]);
                    return;
                }
                console.log(reviewsData);
                setReviews(reviewsData.data?.reviews || []);
                setError(null);
            } catch (requestError) {
                setReviews([]);
                setError(requestError.message || 'Unable to load reviews. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id, type]);

    // Name of the subject this page is scoped to (the student/course/faculty
    // that `id` points at), shown in the header.
    useEffect(() => {
        const config = ENTITY_CONFIG[type];
        if (!config) return;

        let cancelled = false;
        config
            .getInfo(id)
            .then((res) => {
                if (cancelled) return;
                const info = res.data?.[type] || res.data || res;
                setSubjectName(extractName(info));
            })
            .catch(() => {
                if (!cancelled) setSubjectName(null);
            });

        return () => {
            cancelled = true;
        };
    }, [id, type]);

    // Resolve the two related entity names for every review (e.g. for a
    // course's reviews: which student wrote it, which faculty it was for).
    useEffect(() => {
        if (reviews.length === 0 || otherEntities.length === 0) return;

        let cancelled = false;

        otherEntities.forEach((entityType) => {
            const config = ENTITY_CONFIG[entityType];
            const uniqueIds = [
                ...new Set(reviews.map((review) => getEntityId(review, entityType)).filter(Boolean)),
            ];
            const idsToFetch = uniqueIds.filter((entityId) => !(`${entityType}:${entityId}` in entityNames));
            if (idsToFetch.length === 0) return;

            Promise.all(
                idsToFetch.map((entityId) =>
                    config
                        .getInfo(entityId)
                        .then((res) => {
                            const info = res.data?.[entityType] || res.data || res;
                            return [entityId, extractName(info) || 'Unknown'];
                        })
                        .catch(() => [entityId, 'Unknown']),
                ),
            ).then((pairs) => {
                if (cancelled) return;
                setEntityNames((prev) => {
                    const next = { ...prev };
                    pairs.forEach(([entityId, name]) => {
                        next[`${entityType}:${entityId}`] = name;
                    });
                    return next;
                });
            });
        });

        return () => {
            cancelled = true;
        };
        // entityNames is intentionally excluded — it's only read to dedupe fetches.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviews, otherEntities.join(',')]);

    const reviewMeta = useMemo(() => {
        const map = {};
        reviews.forEach((review) => {
            map[review._id] = otherEntities.map((entityType) => {
                const entityId = getEntityId(review, entityType);
                const name = entityId ? entityNames[`${entityType}:${entityId}`] : null;
                return { entityType, name: name || 'Loading…', label: ENTITY_CONFIG[entityType].nounLabel };
            });
        });
        return map;
    }, [reviews, otherEntities, entityNames]);

    const filteredReviews = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return reviews;

        return reviews.filter((review) => {
            const textFields = [review.comment, review.content, review.semester].filter(Boolean);
            const nameFields = (reviewMeta[review._id] || []).map((meta) => meta.name);
            return [...textFields, ...nameFields].some((value) =>
                String(value).toLowerCase().includes(query),
            );
        });
    }, [reviews, search, reviewMeta]);

    const label = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

    const openEdit = (review) => {
        setSaveError(null);
        setEditingReview(review);
        setEditForm({
            rating: review.rating ?? '',
            difficultyRating: review.difficultyRating ?? '',
            semester: review.semester ?? '',
            comment: review.comment ?? review.content ?? '',
        });
    };

    const closeEdit = (open) => {
        if (open) return;
        if (saving) return;
        setEditingReview(null);
        setSaveError(null);
    };

    const handleEditSave = async () => {
        if (!editingReview) return;

        setSaving(true);
        setSaveError(null);
        try {
            const payload = {
                rating: editForm.rating === '' ? undefined : Number(editForm.rating),
                difficultyRating: editForm.difficultyRating === '' ? undefined : Number(editForm.difficultyRating),
                semester: editForm.semester || undefined,
                comment: editForm.comment,
            };
            await patchReview(editingReview._id, payload);
            setReviews((prev) =>
                prev.map((review) =>
                    review._id === editingReview._id ? { ...review, ...payload } : review,
                ),
            );
            setEditingReview(null);
            <Toast type="success" message="Review updated successfully" />;
        } catch (updateError) {
            setSaveError(updateError.message || 'Unable to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const openDelete = (review) => {
        setDeleteError(null);
        setDeletingReview(review);
    };

    const closeDelete = (open) => {
        if (open) return;
        if (deleting) return;
        setDeletingReview(null);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingReview) return;

        setDeleting(true);
        setDeleteError(null);
        try {
            await deleteReview(deletingReview._id);
            setReviews((prev) => prev.filter((review) => review._id !== deletingReview._id));
            setDeletingReview(null);
            <Toast type="success" message="Review deleted successfully" />;
        } catch (deleteErr) {
            setDeleteError(deleteErr.message || 'Unable to delete this review. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-57px)] bg-slate-950 px-4 py-8 text-slate-50 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-5xl">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All reviews
                </button>

                <header className="mt-6 rounded-3xl border border-cyan-300/15 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                                <MessageSquareText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">CourseCompass</p>
                                <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                                    {label} reviews
                                    {subjectName && <span className="text-cyan-200"> · {subjectName}</span>}
                                </h1>
                            </div>
                        </div>
                        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                            <span className="font-bold text-cyan-200">{reviews.length}</span> total
                        </div>
                    </div>

                    <div className="relative mt-6">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/70" />
                        <Input
                            className="w-full rounded-xl border-cyan-300/15 bg-slate-950/60 py-3 pr-4 pl-11 text-sm text-cyan-50 placeholder:text-slate-500 focus-visible:border-cyan-300/50 focus-visible:ring-cyan-300/10"
                            placeholder="Search comments, semesters, students, courses, or faculty..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </header>

                {error ? (
                    <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-4 text-sm text-red-200">{error}</div>
                ) : loading ? (
                    <div className="mt-6 grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-2xl border border-cyan-300/10 bg-slate-900/70 p-5">
                                <Skeleton className="h-4 w-32 bg-slate-800" />
                                <Skeleton className="mt-4 h-4 w-full bg-slate-800" />
                                <Skeleton className="mt-2 h-4 w-2/3 bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <div className="mt-6 grid gap-4">
                        {filteredReviews.map((review) => (
                            <article key={review._id} className="group rounded-2xl border border-cyan-300/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 transition hover:border-cyan-300/20">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-amber-300">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="font-bold">{review.rating ?? '—'} / 5</span>
                                        {review.difficultyRating != null && (
                                            <span className="text-sm text-slate-400">Difficulty: {review.difficultyRating}/5</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {review.semester && (
                                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">{review.semester}</span>
                                        )}

                                        <div className="flex items-center gap-1 border-l border-slate-700/60 pl-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEdit(review)}
                                                        aria-label="Edit review"
                                                        className="h-8 w-8 text-slate-400 hover:bg-cyan-300/10 hover:text-cyan-200"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit review</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDelete(review)}
                                                        aria-label="Delete review"
                                                        className="h-8 w-8 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete review</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                {reviewMeta[review._id]?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                                        {reviewMeta[review._id].map((meta, i) => (
                                            <span key={meta.entityType} className="flex items-center gap-2">
                                                {i > 0 && <Separator orientation="vertical" className="h-3 bg-slate-700" />}
                                                <span className="text-slate-500">{meta.label}:</span>
                                                <span className="font-semibold text-slate-300">{meta.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="mt-4 leading-7 text-slate-200">{review.comment || review.content || 'No written comment was provided.'}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-cyan-300/20 bg-slate-900/40 px-6 py-14 text-center">
                        <MessageSquareText className="mx-auto h-8 w-8 text-cyan-300/60" />
                        <h2 className="mt-4 text-lg font-bold text-slate-100">No reviews found</h2>
                        <p className="mt-1 text-sm text-slate-400">{search ? 'Try a different search term.' : 'There are no reviews to display yet.'}</p>
                    </div>
                )}
            </div>

            {/* Edit dialog */}
            <Dialog open={!!editingReview} onOpenChange={closeEdit}>
                <DialogContent className="border-cyan-300/15 bg-slate-900 text-slate-50 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit review</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update the rating, difficulty, semester, or comment.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="edit-rating" className="text-slate-400">Rating</FieldLabel>
                                <Input
                                    id="edit-rating"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={editForm.rating}
                                    onChange={(e) => setEditForm((f) => ({ ...f, rating: e.target.value }))}
                                    className="border-cyan-300/15 bg-slate-950/60 text-cyan-50"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-difficulty" className="text-slate-400">Difficulty</FieldLabel>
                                <Input
                                    id="edit-difficulty"
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={editForm.difficultyRating}
                                    onChange={(e) => setEditForm((f) => ({ ...f, difficultyRating: e.target.value }))}
                                    className="border-cyan-300/15 bg-slate-950/60 text-cyan-50"
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="edit-semester" className="text-slate-400">Semester</FieldLabel>
                            <Input
                                id="edit-semester"
                                type="text"
                                value={editForm.semester}
                                onChange={(e) => setEditForm((f) => ({ ...f, semester: e.target.value }))}
                                className="border-cyan-300/15 bg-slate-950/60 text-cyan-50"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="edit-comment" className="text-slate-400">Comment</FieldLabel>
                            <Textarea
                                id="edit-comment"
                                rows={4}
                                value={editForm.comment}
                                onChange={(e) => setEditForm((f) => ({ ...f, comment: e.target.value }))}
                                className="resize-none border-cyan-300/15 bg-slate-950/60 text-cyan-50"
                            />
                        </Field>
                    </FieldGroup>

                    {saveError && (
                        <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">{saveError}</div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => closeEdit(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleEditSave}
                            disabled={saving}
                            className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                        >
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deletingReview} onOpenChange={closeDelete}>
                <DialogContent className="border-red-400/20 bg-slate-900 text-slate-50 sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                            <Trash2 className="h-5 w-5" />
                        </div>
                        <DialogTitle className="mt-4 text-white">Delete this review?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            This can't be undone. The review will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                        <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">{deleteError}</div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => closeDelete(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-red-500 text-white hover:bg-red-400"
                        >
                            {deleting ? 'Deleting…' : 'Delete review'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export default Reviews;
