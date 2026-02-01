"use client";

import { MapPin, Clock, Phone, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface JobListing {
  id: string;
  position: string;
  location: string;
  workingHours: string;
  contactNumber: string;
  salary: string;
  createdDate: string;
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
  },
  {
    id: "2",
    position: "Sous Chef",
    location: "Phuket, Thailand",
    workingHours: "10:00 AM - 7:00 PM",
    contactNumber: "+66 2 555 5678",
    salary: "฿50,000 - ฿70,000/month",
    createdDate: "January 20, 2026",
  },
  {
    id: "3",
    position: "Restaurant Manager",
    location: "Chiang Mai, Thailand",
    workingHours: "8:00 AM - 5:00 PM",
    contactNumber: "+66 2 555 9012",
    salary: "฿60,000 - ฿90,000/month",
    createdDate: "January 25, 2026",
  },
  {
    id: "4",
    position: "Server",
    location: "Bangkok, Thailand",
    workingHours: "11:00 AM - 10:00 PM",
    contactNumber: "+66 2 555 3456",
    salary: "฿25,000 - ฿35,000/month",
    createdDate: "January 28, 2026",
  },
];

export default function Careers() {
  const route = useRouter();

  return (
    <main className="min-h-screen secondary_background">
      <Header />

      {/* Main Content Section */}
      <section className="pt-32 pb-16 px-6">
        {/* Description Text */}
        <div className="container mx-auto max-w-4xl text-center">
          <p className="font-serif text-xl md:text-2xl font-light leading-relaxed heading2">
            We&apos;re fast moving team that strive to offer the best Asian food
            in Thailand. We&apos;re looking for those who share the same values:
            quality, dedication, and velocity, with us.
          </p>
        </div>
        <div className="container mx-auto max-w-7xl mt-16">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Left Column - Header */}
            <div className="lg:col-span-1">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light italic leading-tight heading2">
                Join
                <br />
                Bam&apos;s
                <br />
                Team
              </h1>
              <p className="font-serif italic text-xl primary_text mt-2">
                JOIN US!
              </p>
            </div>

            {/* Right Column - Job Cards */}
            <div className="lg:col-span-3">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobListings.map((job) => (
                  <div key={job.id}>
                    <Card
                      className="h-full card cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-border hover:border-primary/50"
                      onClick={() => route.push(`/careers/${job.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="font-serif text-2xl font-light heading">
                          {job.position}
                        </CardTitle>
                        <div className="flex items-center gap-2 sub_heading">
                          <MapPin size={16} />
                          <span className="text-sm sub_heading">{job.location}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Clock
                              size={16}
                              className="sub_heading shrink-0"
                            />
                            <div>
                              <p className="text-xs uppercase tracking-wide sub_heading">
                                Working Hours
                              </p>
                              <p className="text-sm sub_heading">{job.workingHours}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Phone
                              size={16}
                              className="sub_heading shrink-0"
                            />
                            <div>
                              <p className="text-xs uppercase tracking-wide sub_heading">
                                Contact Number
                              </p>
                              <p className="text-sm sub_heading">{job.contactNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <DollarSign
                              size={16}
                              className="sub_heading shrink-0"
                            />
                            <div>
                              <p className="text-xs uppercase tracking-wide sub_heading">
                                Salary
                              </p>
                              <p className="text-sm sub_heading">{job.salary}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar
                              size={16}
                              className="sub_heading shrink-0"
                            />
                            <div>
                              <p className="text-xs uppercase tracking-wide sub_heading">
                                Posted
                              </p>
                              <p className="text-sm sub_heading">{job.createdDate}</p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-4">Apply Now</Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
