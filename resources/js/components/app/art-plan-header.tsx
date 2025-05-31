import ArtPlanHeaderSection from './art-plan-header-section';
import MascotArtSection from './mascot-art-section';

export default function ArtPlanHeader() {
    return (
        <section className="py-16">
            <div className="app-container">
                <ArtPlanHeaderSection />
            </div>
            <MascotArtSection />
        </section>
    );
}
