{
  /* <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Country</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FormField
              control={control}
              name="passportNo"
              render={({ field }) => (
                <Input
                  label={"Passport number"}
                  className="flex-1"
                  {...field}
                  error={errors.passportNo?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="issueDate"
              render={({ field }) => (
                <div className=" flex flex-col gap-2 flex-1">
                  <Label className="text-b3-b font-semibold">Issue Date</Label>
                  <DatePicker
                    selected={field.value as string}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                  />
                </div>
              )}
            />
            <FormField
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <div className=" flex flex-col gap-2 flex-1">
                  <Label className="text-b3-b font-semibold">Expiry Date</Label>
                  <DatePicker
                    selected={field.value as string}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="visa"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Visa</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FormField
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <div className=" flex flex-col gap-2 flex-1">
                  <Label className="text-b3-b font-semibold">
                    Visa Expiry Date
                  </Label>
                  <DatePicker
                    selected={field.value as string}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="serviceType"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">
                    Service Type
                  </Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Location</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FormField
              control={control}
              name="source"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Source</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="leadGenerator"
              render={({ field }) => (
                <Input
                  label={"Lead Generator"}
                  className="flex-1"
                  {...field}
                  error={errors.passportNo?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="assignedTo"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Assigned to</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Status</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="-Select-" className="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <div className="w-full" suppressHydrationWarning>
            <TinyEditor />
          </div> */
}

