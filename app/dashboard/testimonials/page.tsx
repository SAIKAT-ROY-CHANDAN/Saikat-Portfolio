import { connectToDatabase } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { testimonials as defaultTestimonials } from "@/data";
import TestimonialManager from "@/components/dashboard/TestimonialManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  let list: any[] = [];
  try {
    await connectToDatabase();
    list = JSON.parse(
      JSON.stringify(
        await Testimonial.find({})
          .sort({ priority: 1, createdAt: -1 })
          .lean()
          .exec()
      )
    );
  } catch {
    list = [];
  }
  const entries = list.length
    ? list
    : defaultTestimonials.map((t) => ({ ...t, isDefault: true }));

  return <TestimonialManager items={entries} />;
}