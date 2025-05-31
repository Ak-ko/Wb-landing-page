import DynamicArtHeader from './dynamic-art-header';

export default function MascotArtSection() {
    return (
        <div className="my-20">
            <DynamicArtHeader
                containerClass="flex flex-col items-end"
                title={
                    <>
                        <span className="text-[#FF5A01]">Mascot</span> Art
                    </>
                }
                titleClass="text-end"
                description={`We don’t just draw characters; we craft brand ambassadors that connect with your audience. From cute monsters to cool superheroes, we’ll design a mascot that grabs attention and wins hearts. Ready to give your brand a friendly face that makes competitors say, "Why didn’t we think of that?"`}
                descriptionClass="text-end ml-auto"
            />
        </div>
    );
}
