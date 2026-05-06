export interface UserName {
  title: string
  first: string
  last: string
}

export interface RandomUser {
  login: { uuid: string }
  name: UserName
  gender: string
  location: {
    street: { number: number; name: string }
    city: string
    state: string
    country: string
  }
  email: string
  phone: string
  picture: { large: string; medium: string; thumbnail: string }
  dob: { date: string; age: number }
}

export interface AppUser extends RandomUser {
  savedInDb: boolean
  modifiedName?: UserName
}
