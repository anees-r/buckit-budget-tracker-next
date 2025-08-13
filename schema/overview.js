import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import z from "zod";

export const OverviewQueryScheme = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
}).refine((args) => {
    const {to, from} = args;

    const days = differenceInDays(to, from);

    const isValidRange = days >=0 && days <= MAX_DATE_RANGE_DAYS;

    return isValidRange;
})