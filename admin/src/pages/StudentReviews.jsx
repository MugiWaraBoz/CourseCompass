import { useParams } from 'react-router-dom';
import Reviews from '@/components/common/reviews';

function StudentReviews() {
  const { id } = useParams();
  // console.log("Student ID:", id); // Log the studentId to verify it's being captured correctly
  return (
    <>
      <Reviews id={id} type="student" />
    </>
  );
}

export default StudentReviews;
