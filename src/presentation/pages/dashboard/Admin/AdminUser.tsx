import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/tooltip";

const AdminUser = () => {
    return (
        <div className="w-full flex justify-between h-fit py-2">
            <div className="flex gap-2">
                <Input
                    startContent={<Icon icon="solar:magnifer-outline" />}
                    placeholder="Search ..."
                    color="primary"
                    size="md"
                    classNames={{ input: "rounded-lg" }}
                />
                <Tooltip content="Filtrer" placement="right" color="primary">
                    <Button
                        isIconOnly={true}
                        children={<Icon icon="solar:filter-bold" />}
                        className="bg-nextblue-500 text-white text-lg font-bold rounded-lg hover:bg-nextblue-600"
                    />
                </Tooltip>
            </div>
            <div className="flex gap-2">
                <Tooltip content="Exporter" placement="left" color="primary">
                    <Button
                        isIconOnly={true}
                        children={<Icon icon="solar:download-linear" />}
                        className="bg-white text-slate-950 text-lg font-bold rounded-lg hover:bg-slate-50"
                    />
                </Tooltip>
                <Button
                    size="md"
                    className="bg-nextblue-500 text-white   rounded-lg hover:bg-nextblue-600">
                    Ajouter
                </Button>
                <Button
                    size="md"
                    className="bg-slate-800 text-white   rounded-lg hover:bg-nextblue-900">
                    Importer
                </Button>
            </div>
        </div>
    );
};

export default AdminUser;
