import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Household Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm">
          For each category of tasks below, please indicate the injured party's
          ability to complete the listed tasks using a scale of 0-5, as
          described below:
          <ol className="mx-4">
            <li>
              0 - Injury has no impact on ability to complete task, or did not
              complete task prior to injury.
            </li>
            <li>1 - Injury has a minor impact on ability to complete task.</li>
            <li>
              2 - Injury has a moderate impact on ability to complete task.
            </li>
            <li>3 - Injury has a major impact on ability to complete task.</li>
            <li>4 - Injury has a severe impact on ability to complete task.</li>
            <li>5 - Injury completely prevents completion of these tasks.</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="dependentCareRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label
              htmlFor="dependentCareRating"
              className="text-base font-medium"
            >
              Care of Dependent Family Members
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              dressing, bathing, feeding, supervising, or transporting to and
              from events (includes children and adults)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="petCareRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label htmlFor="petCareRating" className="text-base font-medium">
              Pet Care
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              feeding, grooming, walking, picking up after, or otherwise caring
              for household pets
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="indoorHouseworkRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label
              htmlFor="indoorHouseworkRating"
              className="text-base font-medium"
            >
              Indoor Housework
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              vacuuming, sweeping, mopping, dusting, making beds, emptying
              trash, washing clothes, ironing, folding and putting laundry away,
              putting groceries away
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="foodPreparationRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label
              htmlFor="foodPreparationRating"
              className="text-base font-medium"
            >
              Meal Preparation and Cleanup
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              food preparation, cooking, serving, setting & clearing a table,
              washing dishes, loading & unloading a dishwasher, cleaning the
              kitchen
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="homeYardMaintenanceRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label
              htmlFor="homeYardMaintenanceRating"
              className="text-base font-medium"
            >
              Home/Yard Maintenance
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              painting, house repairs, gardening, mowing, trimming, edging,
              weeding
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="vehicleMaintenanceRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label
              htmlFor="vehicleMaintenanceRating"
              className="text-base font-medium"
            >
              Vehicle Maintenance
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              car washing, vacuuming, arranging appointments for maintenance &
              repair, taking vehicles to appointments
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-2">
            <Input
              type="number"
              min="0"
              max="5"
              name="errandsRating"
              placeholder="0-5"
              className="text-center"
            />
          </div>
          <div className="md:col-span-10">
            <Label htmlFor="errandsRating" className="text-base font-medium">
              Errands
            </Label>
            <div className="text-sm text-muted-foreground mt-1">
              shopping for groceries and other household items, disposing of
              trash, yard waste, etc. and other travel to complete tasks not
              included in other categories
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
