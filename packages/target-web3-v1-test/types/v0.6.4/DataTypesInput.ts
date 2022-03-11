/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface DataTypesInput extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): DataTypesInput;
  clone(): DataTypesInput;
  methods: {
    input_address(input1: string): NonPayableTransactionObject<string>;

    input_bool(input1: boolean): NonPayableTransactionObject<boolean>;

    input_bytes(input1: string | number[]): NonPayableTransactionObject<string>;

    input_bytes1(
      input1: string | number[]
    ): NonPayableTransactionObject<string>;

    input_enum(
      input1: number | string | BN
    ): NonPayableTransactionObject<string>;

    input_int256(
      input1: number | string | BN
    ): NonPayableTransactionObject<string>;

    input_int8(
      input1: number | string | BN
    ): NonPayableTransactionObject<string>;

    input_multiple_structs_with_same_name(
      info1: [number | string | BN, number | string | BN]
    ): NonPayableTransactionObject<[string, string]>;

    input_stat_array(
      input1: (number | string | BN)[]
    ): NonPayableTransactionObject<string[]>;

    input_string(input1: string): NonPayableTransactionObject<string>;

    input_struct(
      input1: [number | string | BN, number | string | BN]
    ): NonPayableTransactionObject<[string, string]>;

    input_struct2(
      input1: [
        number | string | BN,
        [number | string | BN, number | string | BN]
      ]
    ): NonPayableTransactionObject<[string, [string, string]]>;

    input_struct2_array(
      input1: [
        number | string | BN,
        [number | string | BN, number | string | BN]
      ][]
    ): NonPayableTransactionObject<[string, [string, string]][]>;

    input_struct2_tuple(
      input: [
        number | string | BN,
        [number | string | BN, number | string | BN]
      ][]
    ): NonPayableTransactionObject<[string, [string, string]][]>;

    input_struct3_array(
      input1: [(number | string | BN)[]][]
    ): NonPayableTransactionObject<[string[]][]>;

    input_struct_array(
      input1: [number | string | BN, number | string | BN][]
    ): NonPayableTransactionObject<[string, string][]>;

    input_struct_array_array(
      input1: [number | string | BN, number | string | BN][][]
    ): NonPayableTransactionObject<[string, string][][]>;

    input_struct_array_array_array(
      input1: [number | string | BN, number | string | BN][][][]
    ): NonPayableTransactionObject<[string, string][][][]>;

    input_struct_array_fixedarray(
      input1: [number | string | BN, number | string | BN][][]
    ): NonPayableTransactionObject<[string, string][][]>;

    input_struct_fixedarray_array(
      input1: [number | string | BN, number | string | BN][][]
    ): NonPayableTransactionObject<[string, string][][]>;

    input_struct_fixedarray_array_fixedarray(
      input1: [number | string | BN, number | string | BN][][][]
    ): NonPayableTransactionObject<[string, string][][][]>;

    input_struct_fixedarray_array_fixedarray_array_fixedarray(
      input1: [number | string | BN, number | string | BN][][][][][]
    ): NonPayableTransactionObject<[string, string][][][][][]>;

    input_struct_fixedarray_fixedarray(
      input1: [number | string | BN, number | string | BN][][]
    ): NonPayableTransactionObject<[string, string][][]>;

    input_tuple(
      input1: number | string | BN,
      input2: number | string | BN
    ): NonPayableTransactionObject<{
      0: string;
      1: string;
    }>;

    input_uint256(
      input1: number | string | BN
    ): NonPayableTransactionObject<string>;

    input_uint8(
      input1: number | string | BN
    ): NonPayableTransactionObject<string>;

    input_uint_array(
      input1: (number | string | BN)[]
    ): NonPayableTransactionObject<string[]>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
