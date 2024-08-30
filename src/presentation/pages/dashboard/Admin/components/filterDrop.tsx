import { DropdownItem, DropdownMenu } from "@nextui-org/dropdown";

const FilterDrop = () => {
    return (
        <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
                Delete file
            </DropdownItem>
        </DropdownMenu>
    );
};

export default FilterDrop;
