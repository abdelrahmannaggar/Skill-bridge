import React from "react";
import { Link } from 'react-router-dom';
import logo from '../imges/213524855.png';
import coursesCRS from '../imges/gettyimages-2148163015-612x612.jpg';
import coursesCRS2 from '../imges/ui and ux.png';
import './Home.css';

function Home(){
    return(
        <div className="home">
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <a href="index.html">
                            <img src={logo} alt="logo" />
                        </a>
                    </div>
                    <div className="main-menu">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                    {/* <!-- Hamburger Button --> */}
                    <button className="hamburger-button">
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </button>
                    <div className="mobile-menu">
                        <ul>
                            <li>
                                <a href="profilepage.html">Profile </a>
                            </li>
                            <li>
                                <a href="#">Swap Skill</a>
                            </li>
                            <li>
                                <a href="#">Pricing</a>
                            </li>
                            <li>
                                <a href="messages.html">Messages</a>
                            </li>
                            <li>
                                <a href="#">Upcoming Events</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* <!-- Hero --> */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-heading text-xxl">
                            Unlock your potential, connect with opportunities, and build the future you deserve.
                        </h1>
                        <p className="hero-text">
                            Learn, share, and grow—swap skills, master new talents, and connect through courses, events, and workshops all seamlessly integrated on our platform." 
                        </p>
                        <div className="hero-buttons">
                            <a href="#" className="btn btn-primary">Explore Courses</a>
                            <a href="#" className="btn"><i className="fas fa-laptop"></i>Swap Skill</a>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- Video Section --> */}
            <section className="video bg-black">
                <div className="container-sm">
                   
                    <h2 className="video-heading text-xl text-center">
                        See how it works and get started in less than 2 minutes
                    </h2>
                      
                </div>
                <video width="800" controls>
                    {/* <source src="Images/studying video.mp4" type="video/mp4"> */}
                </video>
                <h2> <a href="#" className="btn btn-light-color">Get Started</a></h2>
            </section>

            <section className="benefits bg-light">
                <div className="container-bf">
                    <h2 className="benefitss-heading text-xl">
                        Benefits
                    </h2>
                    <div className="benefits-grid">
                        <div className="card2">
                            <h3>01</h3>
                            <h4>
                                Accelerates Personal Growth
                            </h4>

                            <p>Continuous learning helps you stay updated, develop new abilities, and boost self-confidence in your expertise.</p>
                        </div>
                        <div className="card2">
                            <h3>02</h3>
                            <h4>
                                Expands Career Opportunities
                            </h4>
                            <p>
                                Acquiring new skills makes you more competitive in the job market, leading to better job prospects and career advancements.
                            </p>
                        </div>
                        <div className="card2">
                            <h3>03</h3>
                            <h4>
                                Saves Time & Money
                            </h4>
                            <p>Instead of paying for expensive courses, skill swapping enables you to learn directly from others in a practical and cost-effective way.</p>
                        </div>
                        <div className="card2">
                            <h3>04</h3>
                            <h4>
                                Boosts Creativity & Innovation 
                            </h4>
                            <p>
                                Exposure to diverse skills and perspectives sparks creativity and helps generate fresh ideas for personal or professional projects.
                            </p>
                        </div>
                        <div className="card2">
                            <h3>05</h3>
                            <h4>
                                Empowers Communities
                            </h4>
                            <p>Sharing knowledge strengthens communities by making education more accessible, allowing people to grow together and uplift each other.</p>
                        </div>
                        <div className="card2">
                            <h3>06</h3>
                            <h4> 
                                Encourages Collaboration & Networking 
                            </h4>
                            <p>
                                Skill sharing allows you to connect with professionals from different fields, fostering valuable relationships and teamwork.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--our courses--> */}
            <section className="Courses bg-black">
                <div className="container-crs">
                    <h2 className="courses-text-xl">
                        Our Courses  
                    </h2>
                    <div className="courses-grid">
                        <div className="crs">
                            <img src={coursesCRS} alt="clayart" className="courses-img" />
                            <h3>Web Design Fundmentals</h3>
                            <h4></h4>
                            <p>Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>
                        <div className="crs">
                            <img src={coursesCRS2} alt="mechatronics" className="courses-img" />
                            <h3>UI/UX Design</h3>
                            <h4></h4>
                            <p>Master the art of creating intuitive user interfaces (UI) and enhancing user experiences (UX). Learn design principles, wireframing, prototyping, and usability testing techniques.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>
                        <div className="crs">
                            {/* <img src="Images/mobile app development.jpg" alt="mechatronics" className="courses-img"> */}
                            <h3>Mobile App Development</h3>
                            <h4></h4>
                            <p>Dive into the world of mobile app development. Learn to build native iOS and Android applications using industry-leading frameworks like Swift and Kotlin.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>
                        <div className="crs">
                            {/* <img src="Images/graphic.jpg" alt="mechatronics" className="courses-img"> */}
                            <h3>Graphic Designer For beginners</h3>
                            <h4></h4>
                            <p>Discover the fundamentals of graphic design, including typography, color theory, layout design, and image manipulation techniques. Create visually stunning designs for print and digital media.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>
                        <div className="crs">
                            {/* <img src="Images/front end web.jpg" alt="mechatronics" className="courses-img"> */}
                            <h3>Front Web Development</h3>
                            <h4></h4>
                            <p>Become proficient in front-end web development. Learn HTML, CSS, JavaScript, and popular frameworks like Bootstrap and React. Build interactive and responsive websites.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>
                        <div className="crs">
                            {/* <img src="Images/js gg.jpg" alt="mechatronics" className="courses-img"> */}
                            <h3>Advanced JavaScript</h3>
                            <h4></h4>
                            <p>Take your JavaScript skills to the next level. Explore advanced concepts like closures, prototypes, asynchronous programming, and ES6 features. Build complex applications with confidence.</p>
                            <a href="#" className="btn btn-light-color">Get it now</a>
                        </div>

                    </div>

                </div>
            </section>



            {/* <!-- Testimonials --> */}
            <section className="testimonials bg-dark">
                <div className="container">
                    <h3 className="testimonials-heading text-xl">
                        Don't just take our word for it, see the success stories from
                        businesses just like yours.
                    </h3>
                    <div className="testimonials-grid">
                        <div className="card">
                            <p>
                                "Skill Bridge has completely transformed how I learn and share skills! I was able to swap my marketing expertise for web development knowledge, and the interactive courses made learning seamless. The community is incredibly supportive, and the events keep me engaged. Highly recommend it!"
                            </p>

                            <p>Katherine Smith</p>
                            <p>Marketing Specialist</p>
                        </div>

                        <div className="card">
                            <p>
                                "I've always wanted to expand my skill set beyond coding, and Skill Bridge gave me the perfect platform to do that. The workshops are insightful, and the networking opportunities have helped me collaborate with talented professionals. Whether you're learning or teaching, this platform is a game-changer!"
                            </p>

                            <p>Johnathan Lee</p>
                            <p>Software Engineer</p>
                        </div>

                        <div className="card">
                            <p>
                                "As a freelancer, continuous learning is crucial, and Skill Bridge has been my go-to platform for upgrading my skills. The ability to trade skills with others is amazing! I've learned business strategies while teaching design basics. The live events and courses are just the icing on the cake! The best part is that I can connect with like-minded professionals, expand my network, and grow my career in ways I never imagined."             
                            </p>


                            <p>David Wilson</p>
                            <p>Freelance Graphic Designer</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- Pricing --> */}
            <section className="pricing">
                <div className="container-sm">
                    <h3 className="pricing-heading text-xl text-center">Pricing</h3>
                    <p className="pricing-subheading text-md text-center">
                        Start free and scale while you grow. No hidden fees. Unlimited users
                        for free.
                    </p>
                    <div className="pricing-grid">
                        {/* <!-- Pricing Card 1 --> */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home; 