"use client"

import { useState } from "react"
import { ExternalLink, Github } from "lucide-react"
import diveImage from "../assets/dive.png" 
import Dashboard from "../assets/dashboard-divers.png" 
import DiversMap from "../assets/divers-mapping.png" 
import DiversTraining from "../assets/divers-Training.png" 
import UnderWaterVr from "../assets/underwater-vr.png" 
const INITIAL_PROJECT_COUNT = 3

const WorkSection = () => {
  const projects = [
    {
      id: 1,
      title: "Underwater Photography Portfolio",
      description:
        "Showcasing breathtaking marine life and underwater landscapes captured during our expeditions. Features high-resolution galleries and print ordering.",
      image: diveImage, // Use the imported image
      technologies: ["Photography", "Gallery", "E-commerce", "React"],
      liveUrl: "#",
    },
    {
      id: 2,
      title: "Dive Site Mapping & Planning Tool",
      description:
        "An interactive application for mapping dive sites, planning routes, and logging dive details. Essential for safe and organized underwater exploration.",
      image: DiversMap, // Use the imported image
      technologies: ["GIS", "Mapping", "GPS", "React", "Node.js"],
      liveUrl: "#",
    },
    {
      id: 3,
      title: "Marine Conservation Data Dashboard",
      description:
        "Visualizing data on marine biodiversity, coral health, and pollution levels to support conservation efforts and research.",
      image: Dashboard, // Use the imported image
      technologies: ["Data Viz", "Python", "GIS"],
      liveUrl: "#",
    },
    {
      id: 4,
      title: "Diver Training & Certification Portal",
      description:
        "An online platform for managing diver training courses, certifications, and student progress. Streamlining the path to becoming a certified diver.",
      image: DiversTraining, // Use the imported image
      technologies: ["LMS", "Certifications", "User Management"],
      liveUrl: "#",
    },
    {
      id: 5,
      title: "Underwater Exploration VR Experience",
      description:
        "An immersive virtual reality experience allowing users to explore virtual coral reefs and interact with marine life from anywhere.",
      image: UnderWaterVr, // Use the imported image
      technologies: ["VR", "Unity", "3D Modeling", "Gaming"],
      liveUrl: "#",
    },
  ]

  const [visibleProjectsCount, setVisibleProjectsCount] = useState(INITIAL_PROJECT_COUNT)
  const showAllProjects = visibleProjectsCount === projects.length

  const handleToggleProjects = () => {
    console.log("Toggle projects button clicked!") // Debugging log
    if (showAllProjects) {
      setVisibleProjectsCount(INITIAL_PROJECT_COUNT)
    } else {
      setVisibleProjectsCount(projects.length)
    }
  }

  // Tailwind classes for a button mimicking shadcn/ui's outline variant - Adjusted for white theme
  const buttonOutlineClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900"

  return (
    <section id="work" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="section-fade-in">
          <h2 className="text-4xl font-bold text-center text-cyan-600 mb-12 tracking-tight">Our Dive Expeditions</h2>
          <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
            Dive into our recent projects that showcase our passion for the underwater world and innovative solutions
            for exploration and conservation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, visibleProjectsCount).map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-md card-hover border border-gray-200" // Card background white, border light gray
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"} // Use the imported image directly
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{project.title}</h3>{" "}
                  {/* Title text dark gray */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>{" "}
                  {/* Description text dark gray */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium" // Tech tags light blue with dark blue text
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      className={`${buttonOutlineClasses} flex-1 hover:bg-gray-100 hover:text-gray-900 bg-white text-gray-800`}
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </a>
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length > INITIAL_PROJECT_COUNT && (
            <div className="text-center mt-12">
              <button
                className={"t-60 inline-flex items-center bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:ring-cyan-300 font-semibold px-8 py-2 rounded-full text-sm shadow-sm transition-all transform hover:scale-80 active:scale-65 text-white"}
                onClick={handleToggleProjects}
              >
                {showAllProjects ? "Show Less Projects" : "View All Projects"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default WorkSection
