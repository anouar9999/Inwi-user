'use client';
import React from 'react';
import Link from 'next/link';

const TournamentCard = () => {
  return (
    <Link href={'/'} className="block w-full font-pilot">
      <div className="w-full h-28 sm:h-72 md:h-64 relative overflow-hidden bg-[#040714] group">
        {/* Background image with grayscale effect */}
        <div
          className="absolute inset-0 transition-all duration-500 filter grayscale group-hover:grayscale-0"
          style={{
            backgroundImage: `url('https://cdn.dribbble.com/userupload/16156293/file/original-150bb5dc01e1293a57d7062774fd2f26.jpg?resize=1024x768&vertical=center')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Top fade overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-black to-transparent opacity-90 z-10"></div>

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-48 md:h-56 bg-gradient-to-t from-black to-transparent opacity-90 z-10"></div>

        {/* Content */}
        <div className="relative h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between z-20">
          {/* Top section */}
          <div>
            <div className="flex flex-col   gap-2 sm:gap-3 mb-2">
              <h2 className="text-[#647693] font-valorant text-lg sm:text-xl font-light group-hover:text-white line-clamp-2 sm:line-clamp-1">
                00
              </h2>
              <span className={` text-xs  py-1 rounded font-valorant text-white w-fit`}>zzzzz</span>
            </div>
          </div>

          {/* Bottom section with stats and button */}
          <div className="flex flex-col sm:flex-row sm:items-center text-sm -mx-4 sm:-mx-5 md:-mx-6 -mb-4 sm:-mb-5 md:-mb-6 font-semibold">
            {/* Stats section */}
            <div className="grid grid-cols-3 sm:flex sm:items-center px-4 sm:px-0 mb-4 sm:mb-0 transform -translate-y-2">
              <div className="sm:pl-6 sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant"></div>
                <div className="text-white text-sm"></div>
              </div>

              <div className="sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant"></div>
                <div className="text-white uppercase text-sm"></div>
              </div>

              <div className="sm:mr-8 md:mr-11">
                <div className="text-[#647693] text-xs mb-1 font-valorant"></div>
                <div className="text-white text-sm"></div>
              </div>
            </div>

            {/* Button */}
            <Link
              href={'/'}
              className="group relative bg-primary/90 my-2 text-white sm:ml-auto flex items-center h-12 w-full sm:w-auto"
            >
              <div
                className="absolute left-0 top-0 bg-primary/60 h-full w-0 
                transition-all duration-300 ease-out group-hover:w-12"
              />

              <div className="h-12 w-full flex items-center justify-between">
                <span className="relative px-4 z-10 font-custom font-normal tracking-wider text-white uppercase">
                  More Details
                </span>
                <span
                  className="text-white font-custom transition-all duration-300 
                  transform translate-x-0 group-hover:translate-x-1 mr-4"
                >
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ImageCardGrid = () => {
  const items = [
    {
      image:
        'https://static.euronews.com/articles/stories/09/00/98/00/1200x675_cmsv2_3cf1de1a-fd47-54af-bae1-72f78b8a2512-9009800.jpg', // Replace with actual image paths
      title: 'MCCE - Culture',
      link: '/service/mcce',
    },
    {
      image:
        'https://static.euronews.com/articles/stories/09/00/98/00/1200x675_cmsv2_3cf1de1a-fd47-54af-bae1-72f78b8a2512-9009800.jpg',
      title: 'Fondation Nationale des Musées',
      link: '/service/foundation',
    },
    {
      image:
        'https://static.euronews.com/articles/stories/09/00/98/00/1200x675_cmsv2_3cf1de1a-fd47-54af-bae1-72f78b8a2512-9009800.jpg',
      title: 'Tramway de Rabat Salé',
      link: '/service/tramway',
    },
    {
      image: '/image4.jpg',
      title: 'Rahal Animation',
      link: '/service/rahal',
    },
  ];

  return (
    <div className="container-fluid  text-white min-h-screen pb-12 px-0">
      <h3
        className="text-4xl p-6 pb-4 sm:text-5xl lg:text-6xl text-white tracking-wider font-custom 
                    text-left sm:text-left leading-tight"
      >
        Get pass gamers
        <br />
        <span className="text-primary"> AND TRIUMPH</span>
      </h3>

      <div className="grid grid-cols-3 gap-6">
        <TournamentCard />
        <TournamentCard /> <TournamentCard /> <TournamentCard />
      </div>
    </div>
  );
};

export default ImageCardGrid;
