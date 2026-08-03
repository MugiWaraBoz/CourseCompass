import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header>
      <nav>
        <a href="#">Course Compass</a>

        <div>
          <a href="#courses">Courses</a>
          <a href="#faculty">Faculty</a>
          <a href="#about">About</a>
          <Button>Explore Courses</Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
