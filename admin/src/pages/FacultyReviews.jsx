import { useParams } from 'react-router-dom';
import Reviews from '@/components/common/reviews';

function FacultyReviews() {
    const { id } = useParams();
  return (
    <>
      <Reviews id={id} type="faculty" />
    </>
  );
}

export default FacultyReviews;
