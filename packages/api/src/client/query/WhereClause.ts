import type { PropertyDefinition, ObjectDefinition } from "#ontology";

export type PossibleWhereClauseFilters =
  | "gt"
  | "eq"
  | "ne"
  | "isNull"
  | "gte"
  | "lt"
  | "lte";

// We need to conditional here to force the union to be distributed
type MakeFilter<K extends PossibleWhereClauseFilters, V> = K extends string
  ? Omit<{ [k in PossibleWhereClauseFilters]?: undefined }, K> & {
      [k in K]: V;
    }
  : never;

type BaseFilter<T> =
  | T
  | MakeFilter<"eq" | "ne", T>
  | MakeFilter<"isNull", boolean>;

type StringFilter = BaseFilter<string>;
type NumberFilter =
  | BaseFilter<number>
  | MakeFilter<"gt" | "gte" | "lt" | "lte", number>;

type FilterFor<PD extends PropertyDefinition> = PD["type"] extends "string"
  ? StringFilter
  : NumberFilter; // FIXME we need to represent all types

export interface AndWhereClause<T extends ObjectDefinition<any, any>> {
  $and: WhereClause<T>[];
}

export interface OrWhereClause<T extends ObjectDefinition<any, any>> {
  $or: WhereClause<T>[];
}

export interface NotWhereClause<T extends ObjectDefinition<any, any>> {
  $not: WhereClause<T>;
}

export type WhereClause<T extends ObjectDefinition<any, any>> =
  | OrWhereClause<T>
  | AndWhereClause<T>
  | NotWhereClause<T>
  | {
      [P in keyof T["properties"]]?: FilterFor<T["properties"][P]>;
    };
