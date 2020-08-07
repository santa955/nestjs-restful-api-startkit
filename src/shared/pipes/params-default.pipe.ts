import { Injectable, ArgumentMetadata, ParseIntPipe } from '@nestjs/common'

/**
 * 校验参数类型，如果参数未定义，返回undefined, 触发默认参数值机制。
 * 相较于ParseIntPipe，如果参数未定义，不会抛出错误
 */
@Injectable()
export class ParseIntWithDefualtPipe extends ParseIntPipe {
  transform (value: any, metadata: ArgumentMetadata) {
    if ('undefined' === typeof value) return value
    return super.transform(value, metadata)
  }
}