import MissionSection from "../components/mission-section";
import VisionSection from "../components/vision-section";
import TeamSection from "../components/team-section";
import StorySection from "../components/story-section";

export function AboutView() {
  return (
     <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-cyan-700 mb-4">About Sevsea Divers</h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover the story behind Sevsea Divers and our passion for the ocean.
        </p>
    
      
      <MissionSection />
      <VisionSection />
       <StorySection />
      <TeamSection />
    </section>
  );
}
