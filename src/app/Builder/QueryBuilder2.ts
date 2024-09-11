import { FilterQuery, Query } from "mongoose";

class QueryBuilder2<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // methods
  search(searchAbleFields: string[]) {
    if (this?.query && typeof this?.query?.searchTerm === "string") {
      this.modelQuery = this?.modelQuery.find({
        $or: searchAbleFields.map(
          (item) =>
            ({
              [item]: { $regex: this?.query?.searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
  
    // Handle `availableAreas` as an array of values
    if (queryObj.availableAreas && typeof queryObj.availableAreas === "string") {
      const areasArray = (queryObj.availableAreas as string).split(" ");
      queryObj.availableAreas = { $in: areasArray };
    }
  
    // Handle `availability` as an array of values
    if (queryObj.availability && typeof queryObj.availability === "string") {
      const availabilityArray = (queryObj.availability as string).split(" ");
      queryObj.availability = { $in: availabilityArray };
    }
  
    // Handle `category` as an array of values (if applicable)
    if (queryObj.category && typeof queryObj.category === "string") {
      const categoryArray = (queryObj.category as string).split(" ");
      queryObj.category = { $in: categoryArray };
    }
  
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
  

  sort() {
    let sort = "-createdAt";
    if (this?.query && typeof this?.query?.sort === "string") {
      sort = (this?.query?.sort as string).split(",").join(" ");
    }

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    // limit section
    let limit = 6;
    if (this?.query?.limit) {
      limit = this?.query.limit as number;
    }
    // const limitQuery = sortQuery.limit(limit);

    // skip section
    const page = this?.query?.page;
    let skip = 0;
    if (this?.query?.page) {
      skip = (Number(page) - 1) * limit;
    }
    this.modelQuery = this.modelQuery.limit(limit).skip(skip);
    return this;
  }

  fields() {
    // it  should be get   ..fields:"name email gender"
    let fields = "-__v";
    if (this?.query?.fields) {
      fields = (this?.query?.fields as string).split(",").join(" ");
    }
    if (this?.modelQuery) {
      this.modelQuery.select(fields);
    }
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder2;
