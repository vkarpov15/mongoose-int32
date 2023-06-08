import mongodb from 'mongodb';
import { Mongoose } from "mongoose";
import { SchemaType } from 'mongoose';
import mongooseInt32 from '.';

export default function(mongoose?: Mongoose): SchemaType;

declare module 'mongoose' {
  namespace Schema{
    namespace Types {
      class Int32 extends SchemaType{}
    }
  }
  namespace Types {
    class Int32 extends mongodb.Int32 {
      
    }
  }
}