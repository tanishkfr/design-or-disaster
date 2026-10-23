import { Banking, Portfolio, Bulletin, Fashion } from './CollectionExhibits'
import BenefitsForm from './BenefitsForm'

// Each exhibit view accepts controlled state, onAction and frozen props.
export const EXHIBIT_VIEWS = { 'benefits-form-v1': BenefitsForm, 'banking-v1':Banking, 'portfolio-v1':Portfolio, 'bulletin-v1':Bulletin, 'fashion-v1':Fashion }
