import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    // useAuthRedirect();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <div>
            <p>Home Page</p>
            <Button onClick={() => setIsDialogOpen(true)} />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Button
                className="rounded-md"
                color="primary"
                onClick={() => {
                    navigate("/login");
                }}>
                Se Connecter
            </Button>
        </div>
    );
};

export default HomePage;
