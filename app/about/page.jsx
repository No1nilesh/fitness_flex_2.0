import Image from "next/image";
import "@styles/about.css"

export const metadata = {
    title: 'About Us',
    description: 'Gym Management Web App!',
  }

function About() {

  return (
    <>
      <header className="min-h-[85vh] header">
        <div id="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="container-box items-end flex-wrap xl:gap-8">
          <div className="lg:w-[50%] self-end ">
            <Image src={"/assets/dumble.svg"} height={506} width={ 760} alt="dum" />
          </div>
          <div className="right glass w-[35rem] self-center mx-2">
            <h1 className="h-primary text-center">About Us</h1>
            <p>
              At Fitness Flex Gym Software,we're committed to helping gyms and
              fitness center run therir bussiness more efficiently and
              effectively.
            </p>
            <p>
              Our software solutions are designed to simplify gym management and
              improve the member experience, so that gym owners can focus on
              what they do best - helping their members achieve their fitness
              goals.
            </p>
          </div>
        </div>
      </header>

      <div className="mainbox">
        <div className="row gap-2 flex-wrap md:flex-nowrap ">
          <div className="cardd glass md:w-[33%] w-[100%] ">
            <h2 className="card-head">Our Mission</h2>
            <p className="card-para ">
              Our mission is to provide gym owners with the tools and resources
              they need to succeed in a competitive and ever-changing industry.
              We believe that by streamlining gym management processes and
              improving the member experience, we can help gyms of all sizes
              thrive and grow.
            </p>
          </div>

          <div className="cardd glass md:w-[33%] w-[100%]">
            <h2 className="card-head">Our Software</h2>
            <p className="card-para">
              Our gym management software is a powerful and intuitive platform
              that includes everything gyms need to manage their businesses,
              from membership and billing management to class scheduling and
              staff management. Our software is cloud-based, so it can be
              accessed from anywhere with an internet connection, and it's
              customizable to meet the unique needs of each gym.
            </p>
          </div>

          <div className="cardd glass md:w-[33%] w-[100%]">
            <h2 className="card-head">Our Support</h2>
            <p className="card-para">
              We understand that implementing new software can be a daunting
              process, which is why we offer comprehensive support and training
              to ensure that gym owners and staff are comfortable and confident
              using our software. Our team of experts is available to answer
              questions, provide guidance, and troubleshoot any issues that may
              arise.
            </p>
          </div>
        </div>

        <section id="contact">
          <div className="services-info">
            <h1 className="font-bold">
              Get in<span id="color">Touch</span>
            </h1>
          </div>

          <div className=" flex justify-evenly p-8 flex-col lg:flex-row">
            <div className="">
              <form className="form">
                <input type="text" name="" placeholder="E-mail" />
                <input type="text" name="" placeholder="Subject" />
                <br />
                <textarea rows="10" cols="40" placeholder="Message"></textarea>
                <br />{" "}
                <button className="self-center border border-[rgba(255,255,255,0.4)] rounded-md px-[1.5rem] py-1 my-1 bg-[#384BD6] bg-gradient-to-r from-[#384BD6] to-[#3c9ba0] drop-shadow-md  hover:bg-[hsl(186,100%,69%)] w-[100%]">
                  Contact Us
                </button>
              </form>
            </div>


          </div>
        </section>
      </div>
    </>
  );
}

export default About;
