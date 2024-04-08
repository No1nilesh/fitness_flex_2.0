"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSession } from "next-auth/react";
import { Rating } from "../../utils/RatingStar";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { useEffect, useState } from "react";
import { assignTrainerToMember } from "@utils/assignTrainer";

const Slider = () => {
  const { data: session } = useSession();
  const [assignTrainer, setAssignTrainer] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = await assignTrainerToMember(session?.user.id);
        setAssignTrainer(JSON.parse(trainer));
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, [session?.user.id]);

  return (
    <Carousel>
      {/* <CarouselContent>
        {assignTrainer?.map((trainer) => {
          return (
            <CarouselItem
              key={trainer.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card>
                <CardHeader className="text-center font-semibold text-xl">
                  {trainer.name}
                </CardHeader>
                <CardContent>
                  <label>
                    Specialty
                    <p>{trainer.specialty}</p>
                  </label>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <label>
                    Availability
                    <p>
                      {trainer.availability.map((av) => {
                        return <span key={av.day}> {av.day}</span>;
                      })}
                    </p>
                  </label>
                  <div>{Rating(trainer.rating)}</div>
                </CardFooter>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent> */}
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default Slider;
