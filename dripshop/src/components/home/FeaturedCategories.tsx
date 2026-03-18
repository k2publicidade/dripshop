import Link from "next/link";

interface FeaturedCategoryItem {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    buttonText: string;
}

const fallbackCategories: FeaturedCategoryItem[] = [
    {
        id: "1",
        title: "OVERSIZED",
        imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=600&fit=crop",
        linkUrl: "/categoria/oversized",
        buttonText: "COMPRE AQUI",
    },
    {
        id: "2",
        title: "CAMISETAS",
        imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=600&fit=crop",
        linkUrl: "/categoria/camisetas",
        buttonText: "COMPRE AQUI",
    },
    {
        id: "3",
        title: "MOLETOM",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
        linkUrl: "/categoria/moletom",
        buttonText: "COMPRE AQUI",
    },
    {
        id: "4",
        title: "MANGA LONGA",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop",
        linkUrl: "/categoria/manga-longa",
        buttonText: "COMPRE AQUI",
    },
];

interface FeaturedCategoriesProps {
    categories?: FeaturedCategoryItem[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
    const items = categories && categories.length > 0 ? categories : fallbackCategories;

    return (
        <section className="py-6 bg-black">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.linkUrl}
                            className="group relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden block"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/40" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                                <h3
                                    className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none mb-3"
                                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                                >
                                    {item.title}
                                </h3>
                                <span className="inline-block w-fit border border-white/70 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                                    {item.buttonText}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
