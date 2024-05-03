import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Importing slick carousel styles
import 'slick-carousel/slick/slick-theme.css'; // Importing slick carousel theme styles
import Sidebar from '../components/Sidebar';
import './about.css'; // Importing custom CSS styles for the About page
import teamMember1 from '../image/Matthew.png';
import teamMember2 from '../image/William.png';
import teamMember3 from '../image/Mehedi.png';
import teamMember4 from '../image/Kanta.png';

/**
 * About component representing the about page of the application.
 */
function About() {
  // Slider settings for displaying team member information
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="about-page">
      {/* Sidebar component for navigation */}
      <Sidebar />

      {/* Content wrapper for the about page */}
      <div className="content-wrapper">
        <div className="about-content">
          {/* Header area with the title */}
          <header className="header-area">
            <h2>About Us!</h2>
          </header>

          {/* Container for text content */}
          <div className="container-text">
            {/* Body paragraph with information about the application */}
            <div className="body-paragraph">
              <h2><b>Welcome to Pizza Connection!</b></h2>
              <p>
                We've built a website that makes ordering pizza easier and better for both pizza businesses and hungry customers.
                It's simple to use and packed with useful features that integrate various functionalities,
                including customer account management, online ordering, employee time tracking, inventory management, employee management, and sales tracking.
                Our team of four students created this as our senior project,
                and we want to say a big thank you to our advisors GTA Saeed Bhakhshan and Professor Seyed Ziae Mousavi Mojab for their incredible support.
                Without their guidance and mentorship, Pizza Connection wouldn't have come to life; it would have been a nightmare.
              </p>
              <p className="thank-you"><b>Thanks a lot....!</b></p>
            </div>

            {/* Team member section with images and information */}
            <h3><b>Meet Our Team</b></h3>
            <div className="body-image">
              {/* Slider component for displaying team member information */}
              <Slider {...settings}>
                <div>
                  <img src={teamMember1} alt="Matthew Krol" className="team-member-image" />
                  <h3><b>Matthew Krol</b></h3>
                  <p>Team Leader, Pizza Connection <br></br>
                    Senior Computer Science Student, Wayne State University </p>
                </div>
                <div>
                  <img src={teamMember2} alt="William Esparza" className="team-member-image" />
                  <h3><b>William Esparza</b></h3>
                  <p>UI Lead, Pizza Connection<br></br>
                    Senior Computer Science Student, Wayne State University</p>
                </div>
                <div>
                  <img src={teamMember3} alt="Mehedi Zihad" className="team-member-image" />
                  <h3><b>Mehedi Zihad</b></h3>
                  <p>Technical Lead, Pizza Connection<br></br>
                    Senior Computer Science Student, Wayne State University</p>
                </div>
                <div>
                  <img src={teamMember4} alt="Kanta Islam" className="team-member-image" />
                  <h3><b>Kanta Islam</b></h3>
                  <p>Documentation Lead, Pizza Connection<br></br>
                    Senior Computer Science Student, Wayne State University</p>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporting the About component as the default export
export default About;
