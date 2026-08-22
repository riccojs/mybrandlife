import ImageOne from "../../assets/Build-Your-Brand.png";
import ImageTow from "../../assets/Showcase-Yourself.png";
import ImageThree from "../../assets/Grow-Your-Reach.png";
import { Link } from "react-router";

function BrandList() {
  return (
    <section className="my-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="hover-effect">
            <Link to="/pricing">
              <img src={ImageOne} alt="Build-Your-Brand" />
            </Link>
          </div>
          <div className="hover-effect">
            <Link to="/pricing">
              <img src={ImageTow} alt="Showcase-Yourself" />
            </Link>
          </div>
          <div className="hover-effect">
            <Link to="/pricing">
              <img src={ImageThree} alt="Grow-Your-Reach" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandList;
