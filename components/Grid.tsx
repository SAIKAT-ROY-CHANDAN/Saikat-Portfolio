import { gridItems } from "@/data"
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid"

interface GridProps {
  profile?: any;
}

const Grid = ({ profile }: GridProps = {}) => {
    const texts = Array.isArray(profile?.aboutTexts) ? profile.aboutTexts : [];

    return (
        <section id="about">
            <BentoGrid>
                {gridItems.map(({ id, img, title, description, className, imgClassName, titleClassName, spareImg }, index) => {
                    const dynamic = texts[index];
                    const dynamicTitle = dynamic?.title ? dynamic.title : title;
                    const dynamicDescription = dynamic?.description ? dynamic.description : description;
                    return (
                        <BentoGridItem
                            key={id}
                            id={id}
                            title={dynamicTitle}
                            description={dynamicDescription}
                            className={className}
                            img={img}
                            imgClassName={imgClassName}
                            titleClassName={titleClassName}
                            spareImg={spareImg}
                        />
                    )
                })}
            </BentoGrid>
        </section>
    )
}

export default Grid