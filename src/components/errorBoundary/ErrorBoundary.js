import { Component } from 'react';
import Error from '../error/Error';

class ErrorBoundary extends Component {
    state = {
        error: false,
    }

    // static getDerivedStateFromError(error) { // updates the state ONLY
    //     return { error: true } // returns new object, which will update our state
    // }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({error: true});
    }

    render() {
        const {error} = this.state;

        if(error) {
            return (
                <Error/>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;