import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";
import { RiaDialog } from "../dashboard/RiskAssessement/components/riaDialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const HomePage = () => {
    // useAuthRedirect();
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <div>
            <p>Home Page</p>

            <Button
                className="rounded-md"
                color="primary"
                onClick={() => {
                    navigate("/login");
                }}>
                Se Connecter
            </Button>

            <Button
                onClick={() => setDialogOpen(true)}
                variant="light"
                color="warning"
                isIconOnly
                startContent={<Icon icon="solar:calendar-outline" />}
            />
            <RiaDialog
                // refetch={refetch}
                // defaultValues={{}}
                isDialogOpen={dialogOpen}
                setIsDialogOpen={setDialogOpen}
            />
        </div>
    );
};

export default HomePage;
