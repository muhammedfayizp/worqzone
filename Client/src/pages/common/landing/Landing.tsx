import React from 'react';
import './landing.css';
import Header from '../../../components/common/header/header';
import Footer from '../../../components/common/footer/footer';
import img1 from '../../../assets/L1.png';
import img2 from '../../../assets/L2.png';
import img3 from '../../../assets/L3.png';
import img4 from '../../../assets/L4.png';

const Landing = () => {
  return (
    <div className="bg-card min-h-screen w-full text-white">
      
      {/* Header */}
      <Header />

      <main className="px-6 py-12 space-y-16 max-w-7xl mx-auto">
        
        {/* Section 1: Intro */}
        <section className="flex flex-col-reverse lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h2 className="text-4xl font-bold leading-snug">
              Hello, welcome to <br /> your virtual office
            </h2>
            <p className="text-lg leading-relaxed">
              Connect, collaborate, and create with <br />
              your team from anywhere in the world.
            </p>
          </div>
          <div className="flex-shrink-0">
            <img src={img1} alt="Virtual Office" className="w-64 lg:w-80 transition-transform hover:scale-105" />
          </div>
        </section>

        {/* Video Conferencing */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-6">Video Conferencing</h1>
          <section className="justify-between flex flex-col lg:flex-row items-center gap-10">
              <img src={img2} alt="Video Conferencing" className="w-64 lg:w-80 transition-transform hover:scale-105" />
              <p className="text-lg leading-relaxed">
                Communicate face-to-face with your colleagues<br />
                from anywhere, seamlessly and securely — <br />
                featuring screen sharing capabilities.
              </p>
          </section>
        </div>

        {/* Real-time Chat */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-6">Real-time Chat</h1>
          <section className="flex flex-col-reverse lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-lg leading-relaxed">
                Stay connected, share ideas,<br />
                and send files instantly — no delays,<br />
                just smooth teamwork and fast communication!
              </p>
            </div>
            <div className="flex-shrink-0">
              <img src={img3} alt="Real-time Chat" className="w-64 lg:w-80 transition-transform hover:scale-105" />
            </div>
          </section>
        </div>

        {/* Team Collaboration */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-6">Team Collaboration</h1>
          <section className="flex flex-col lg:flex-row items-center gap-10 justify-between">
              <img src={img4} alt="Team Collaboration" className="w-64 lg:w-80 transition-transform hover:scale-105" />
              <p className="text-lg leading-relaxed">
                Organize tasks, track progress,<br />
                and work on documents together —<br />
                everything your team needs,<br />
                all in one smart workspace!
              </p>
          </section>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
