import CreateEventForm from "@components/TrainerComponents/create-event-form";
import { CustomDialog } from "@components/UiComponents/custom-dialog";

const ScheduleDialog = () => {
  return (
    <CustomDialog title={"Schedule"}>
      <CreateEventForm />
    </CustomDialog>
  );
};

export default ScheduleDialog;
