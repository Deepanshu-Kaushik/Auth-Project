export class CreateAppDto {
  readonly name: string;
  readonly logo: string;
  readonly homepage_url: string;
  readonly description: string;
  readonly callback_url: string;
  readonly scope: string;
}
