export class Job {

  constructor(
    public designation: string,
    public description: string,
    public skills: string[],
    public experience: number,
    public postedBy: string,
    public time1: Date,
    public time2: Date,
    public applications?: any[],
    public _id?: string
  ) { }

}
