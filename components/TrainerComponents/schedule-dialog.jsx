import CreateEventForm from "@components/UiComponents/create-event-form";
import { CustomDialog } from "@components/UiComponents/custom-dialog";

const ScheduleDialog = () => {
  return (
    <CustomDialog title={"Schedule"}>
      <CreateEventForm />
    </CustomDialog>
  );
};

export default ScheduleDialog;
