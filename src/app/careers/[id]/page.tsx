import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Phone,
  DollarSign,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface JobListing {
  id: string;
  position: string;
  location: string;
  workingHours: string;
  contactNumber: string;
  salary: string;
  createdDate: string;
  tasks: string[];
  qualifications: string[];
}

const jobListings: JobListing[] = [
  {
    id: "1",
    position: "Head Chef",
    location: "Bangkok, Thailand",
    workingHours: "9:00 AM - 6:00 PM",
    contactNumber: "+66 2 555 1234",
    salary: "฿80,000 - ฿120,000/month",
    createdDate: "January 15, 2026",
    tasks: [
      "Lead and manage the kitchen team to ensure smooth daily operations",
      "Develop and refine menu items that align with our Asian fusion concept",
      "Maintain high standards of food quality, presentation, and taste",
      "Oversee inventory management and food cost control",
      "Ensure compliance with health and safety regulations",
      "Train and mentor junior kitchen staff",
      "Collaborate with management on special events and seasonal menus",
    ],
    qualifications: [
      "Minimum 5 years of experience as a Head Chef or Executive Chef",
      "Expertise in Asian cuisine, particularly Thai, Japanese, or Chinese",
      "Culinary degree or equivalent professional training",
      "Strong leadership and team management skills",
      "Excellent communication and organizational abilities",
      "Ability to work in a fast-paced environment",
      "Food safety certification required",
    ],
  },
  {
    id: "2",
    position: "Sous Chef",
    location: "Phuket, Thailand",
    workingHours: "10:00 AM - 7:00 PM",
    contactNumber: "+66 2 555 5678",
    salary: "฿50,000 - ฿70,000/month",
    createdDate: "January 20, 2026",
    tasks: [
      "Assist the Head Chef in daily kitchen operations",
      "Supervise and coordinate activities of cooks and kitchen staff",
      "Prepare and cook dishes according to recipes and quality standards",
      "Ensure proper food storage and rotation",
      "Help with menu planning and recipe development",
      "Step in for the Head Chef when needed",
    ],
    qualifications: [
      "3+ years of experience in a professional kitchen",
      "Strong knowledge of Asian cooking techniques",
      "Ability to work under pressure during peak hours",
      "Team player with excellent communication skills",
      "Culinary diploma preferred",
      "Food handling certification",
    ],
  },
  {
    id: "3",
    position: "Restaurant Manager",
    location: "Chiang Mai, Thailand",
    workingHours: "8:00 AM - 5:00 PM",
    contactNumber: "+66 2 555 9012",
    salary: "฿60,000 - ฿90,000/month",
    createdDate: "January 25, 2026",
    tasks: [
      "Oversee daily restaurant operations and ensure excellent customer service",
      "Manage staff scheduling, hiring, and performance evaluations",
      "Handle customer complaints and feedback professionally",
      "Monitor financial performance and control costs",
      "Ensure compliance with health and safety standards",
      "Coordinate with kitchen and front-of-house teams",
      "Plan and execute marketing initiatives and events",
    ],
    qualifications: [
      "Bachelor's degree in Hospitality Management or related field",
      "5+ years of restaurant management experience",
      "Strong leadership and interpersonal skills",
      "Proficiency in POS systems and restaurant software",
      "Fluent in Thai and English",
      "Excellent problem-solving abilities",
      "Flexible schedule availability",
    ],
  },
  {
    id: "4",
    position: "Server",
    location: "Bangkok, Thailand",
    workingHours: "11:00 AM - 10:00 PM",
    contactNumber: "+66 2 555 3456",
    salary: "฿25,000 - ฿35,000/month",
    createdDate: "January 28, 2026",
    tasks: [
      "Greet and seat guests in a friendly and professional manner",
      "Present menus and provide detailed information about dishes",
      "Take accurate food and beverage orders",
      "Serve food and drinks promptly and courteously",
      "Handle payments and process transactions",
      "Maintain cleanliness of dining area and table settings",
      "Upsell menu items and specials when appropriate",
    ],
    qualifications: [
      "Previous experience in food service preferred",
      "Excellent communication and customer service skills",
      "Ability to work in a fast-paced environment",
      "Basic English communication skills",
      "Positive attitude and team-oriented mindset",
      "Flexible availability including weekends and holidays",
    ],
  },
];

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const job = jobListings.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen secondary_background">
      <Header />

      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <div className="mb-8">
            <button
              className="heading2"
            >
              <Link href="/careers" className="flex items-center">
                <ChevronLeft size={16} className="mr-2" />
                Back to Careers
              </Link>
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-light mb-3 heading2">
                  {job.position}
                </h1>
                <div className="flex items-center gap-2 sub_heading2">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Tasks Section */}
              <div>
                <h2 className="font-serif text-xl font-light mb-4 border-b border-border pb-2 heading2">
                  Tasks to Be Performed
                </h2>
                <ul className="space-y-3">
                  {job.tasks.map((task, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="sub_heading2 mt-1.5">•</span>
                      <span className="sub_heading2">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications Section */}
              <div>
                <h2 className="font-serif text-xl font-light mb-4 border-b border-border pb-2">
                  Required Qualifications
                </h2>
                <ul className="space-y-3">
                  {job.qualifications.map((qual, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="sub_heading2 mt-1.5">•</span>
                      <span className="sub_heading2">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button - Mobile */}
              <div className="lg:hidden">
                <Button className="w-full" size="lg">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              <Card className="sticky card top-32 border-2 border-border">
                <CardContent className="p-6 space-y-5">
                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={18}
                      className="sub_heading shrink-0"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wide sub_heading">
                        Office Location
                      </p>
                      <p className="text-sm font-medium heading">{job.location}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3">
                    <Clock
                      size={18}
                      className="sub_heading shrink-0"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wide sub_heading">
                        Working Hours
                      </p>
                      <p className="text-sm font-medium heading">{job.workingHours}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <Phone
                      size={18}
                      className="sub_heading shrink-0"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wide sub_heading">
                        Contact Number
                      </p>
                      <p className="text-sm font-medium heading">{job.contactNumber}</p>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-3">
                    <DollarSign
                      size={18}
                      className="sub_heading shrink-0"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wide sub_heading">
                        Salary
                      </p>
                      <p className="text-sm font-medium heading">{job.salary}</p>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-3">
                    <Calendar
                      size={18}
                      className="sub_heading shrink-0"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wide sub_heading">
                        Posted
                      </p>
                      <p className="text-sm font-medium heading">{job.createdDate}</p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full mt-4" size="lg">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
