import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function MyForm() {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="name" placeholder="Enter product name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label>Select the product condition</Form.Label>
                <Form.Select aria-label="Default select example" placeholder="Product Condition" onChange={() => {}}>
                    <option value="Any">Any Condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                </Form.Select>            
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>  
    )
}
