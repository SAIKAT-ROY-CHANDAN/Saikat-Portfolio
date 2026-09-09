import { gridItems } from "@/data"
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid"

interface GridProps {
  profile?: any;
  skills?: any[];
}

const Grid = ({ profile, skills }: GridProps = {}) => {
    const useGridTexts =
        Array.isArray(profile?.gridTexts) && profile.gridTexts.length > 0;
    const overrides = useGridTexts
        ? profile.gridTexts
        : Array.isArray(profile?.aboutTexts)
            ? profile.aboutTexts
            : [];
    const isIdentity = (id: number) => id === 1 && !useGridTexts;

    return (
        <section id="about" className="relative py-20">
            <h1 className="heading">
                get to know{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">me</span>
            </h1>
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white-200">
                the person behind the pixels
            </p>
            <BentoGrid className="mt-12">
                {gridItems.map((item, index) => {
                    const o = overrides[index] ?? {};
                    const chips =
                        Array.isArray(o.chips) && o.chips.length
                            ? o.chips
                            : item.chips;
                    return (
                        <BentoGridItem
                            key={item.id}
                            id={item.id}
                            title={isIdentity(item.id) ? item.title : o.title || item.title}
                            description={isIdentity(item.id) ? item.description : o.description || item.description}
                            className={item.className}
                            img={item.img}
                            imgClassName={item.imgClassName}
                            titleClassName={item.titleClassName}
                            spareImg={item.spareImg}
                            tagline={isIdentity(item.id) ? item.tagline : o.tagline || item.tagline}
                            subtitle={isIdentity(item.id) ? item.subtitle : o.subtitle || item.subtitle}
                            badge={isIdentity(item.id) ? item.badge : o.badge || item.badge}
                            globe={item.globe}
                            chips={chips}
                            skills={item.id === 3 ? skills : undefined}
                        />
                    )
                })}
            </BentoGrid>
        </section>
    )
}

export default Grid