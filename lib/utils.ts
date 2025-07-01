import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const faqData = [
  {
    question: "Why should I hire a forensic economist for a personal injury lawsuit?",
    answer:
      "Personal injury cases require precise calculation of lifetime economic losses that extend far beyond current wage loss, and our expertise ensures that your clients recover all amounts to which they are equitably entitled. We calculate lifetime lost earnings with career advancement projections, identify hidden damages like lost benefits and household services that can add 25-40% to total losses. Insurance adjusters and defense attorneys take cases more seriously when backed by credible economic analysis, strengthening your settlement negotiations and providing concrete justification for damage demands. Most importantly, forensic economists can handle complex earning patterns for business owners and irregular workers, address defense challenges to your damage calculations, and convert future medical costs into defendable present value amounts, ensuring your client receives full compensation rather than rough estimates that leave money on the table.",
  },
  
]