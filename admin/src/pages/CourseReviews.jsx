import { useParams } from 'react-router-dom';
import Reviews from '@/components/common/reviews';

function CourseReviews() {
  const { id } = useParams();
  return (
    <>
    <Reviews id={id} type="course" />
    </>
  );
}

export default CourseReviews;
