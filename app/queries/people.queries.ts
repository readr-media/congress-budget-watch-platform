import { graphql } from "~/graphql";

export const GET_PERSON_BY_ID_QUERY = graphql(`
  query People($where: PeopleWhereUniqueInput!) {
    people(where: $where) {
      id
      name
      party {
        id
        color
        name
      }
      term {
        termNumber
        id
      }
      termCount
      committees {
        id
        name
        session
        term {
          id
          startDate
          termNumber
        }
      }
    }
  }
`);

export const peopleQueryKeys = {
  all: ["people"] as const,
  details: () => [...peopleQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...peopleQueryKeys.details(), id] as const,
} as const;
