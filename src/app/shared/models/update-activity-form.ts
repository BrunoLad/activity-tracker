import { FormControl } from "@angular/forms";
import { Priority } from "../enums/priority.enum";

export interface UpdateActivityForm {
    description: FormControl<string>;
    priority: FormControl<Priority>;
    status?: FormControl<string>;
}
