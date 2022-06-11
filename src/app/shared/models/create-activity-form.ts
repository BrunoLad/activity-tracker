import { FormControl } from "@angular/forms";
import { Priority } from "../enums/priority.enum";

export interface CreateActivityForm {
    topics: FormControl<string[]>;
    category: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
    priority: FormControl<Priority>;
    duration?: FormControl<string>;
    status?: FormControl<string>;
}
