import { gridItems } from "@/data"
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid"


const Grid = () => {
    return (
        <section id="about">
            <BentoGrid>
                {gridItems.map(({ id, img, title, description, className, imgClassName, titleClassName, spareImg }) => (
                    <BentoGridItem
                        key={id}
                        id={id}
                        title={title}
                        description={description}
                        className={className}
                        img={img}
                        imgClassName={imgClassName}
                        titleClassName={titleClassName}
                        spareImg={spareImg}
                    />
                ))}
            </BentoGrid>
        </section>
    )
}

export default Grid