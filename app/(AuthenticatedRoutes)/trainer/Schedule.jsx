import TrainerCalender from "@components/TrainerComponents/TrainerCalender";
import ScheduleDialog from "@components/TrainerComponents/schedule-dialog";

const Schedule = () => {
  return (
    //
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-7 ">
      <div className="rounded-md bg-[#ccddff]  text-card-foreground  col-span-4 w-screen md:w-full h-[32rem]  p-2">
        <TrainerCalender />
        <ScheduleDialog />
      </div>
      <div className="md:w-full col-span-3 bg-card text-card-foreground rounded-md">
        {/* <DataTable columns={columns()} data={assignedMemberData} /> */}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt velit
        mollitia nobis consectetur similique, sit qui eos delectus enim vel, eum
        id nesciunt, sequi nulla officiis odio magni temporibus deleniti.
      </div>
    </div>
  );
};

export default Schedule;
