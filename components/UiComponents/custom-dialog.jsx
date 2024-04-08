import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@ZustandStore/useDialog";

export function CustomDialog({ children, title }) {
  const { onClose, isOpen } = useDialog();
  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
