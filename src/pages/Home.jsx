import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, FormControl, InputGroup, Row, Alert } from 'react-bootstrap';
import connect from 'react-redux/es/connect/connect';
import ListaTweet from '../components/ListaTweet';
import Loading from '../components/Loading';
import TweetService from '../services/TweetService';
import UserList from '../components/UserList';

class Home extends Component {

    static propTypes = {
        usuarioLogado: PropTypes.object
    };

    state = {
        currentPost: '',
        alertVisible: false,
        loading: false,
        users: [],
        tweets: []
    };

    componentDidMount() {
        if (this.props.usuarioLogado !== undefined) {
            this.getUserFeed(this.props.usuarioLogado);
        }
    }

    componentDidUpdate(oldProps) {
        if (this.props.usuarioLogado !== oldProps.usuarioLogado && this.props.usuarioLogado !== undefined) {
            this.getUserFeed(this.props.usuarioLogado);
        }
    }

    getUserFeed = (user) => {
        this.setState({ loading: true }, () => {
            TweetService.getUserFeed(user)
                .then(tweets => {
                    console.log(tweets);
                    this.setState({ tweets, loading: false });
                });
        })
    };


    onChange = (event) => {
        this.setState({ currentPost: event.target.value })
    };

    onPost = () => {

        const { currentUser } = this.props;

        if (!currentUser) {
            this.setState({ alertVisible: true })
            return;
        }

        const newTweet = {
            content: this.state.currentPost,
            uid: new Date(Date.now()).toISOString(),
            author: currentUser.uid,
            timestamp: Date.now(),
            authorName: currentUser.displayName,
            authorUserName: currentUser.userName,
            authorPhotoURL: currentUser.photoURL
        };

        this.setState({ currentPost: '', alertVisible: false }, () => {
            this.props.onTweet(newTweet);
        })
    };

    render() {

        const { currentPost, alertVisible, tweets, loading, users } = this.state;

        if (loading) {
            return (
                <div className="lds-container">
                    <Loading />
                </div>
            );
        }

        return (
            <Container style={{ marginTop: 30 }}>               
                <UserList users={users}/>
                <Alert variant="danger" defaultShow={alertVisible}>
                    Você deve estar logado para postar alguma coisa.
                </Alert>
                <Form>
                    <Row>
                        <span className="ml-auto">{currentPost.length} / 140</span>
                        <InputGroup>
                            <FormControl as="textarea" aria-label="With textarea" maxLength={140}
                                value={currentPost} onChange={this.onChange} />
                        </InputGroup>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                        <Button variant="primary" onClick={this.onPost}>Postar</Button>
                    </Row>

                    <Row>
                        <ListaTweet tweets={tweets} />
                    </Row>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usuarioLogado: state.usuario.usuarioAtual
    }
}

export default connect(mapStateToProps)(Home);
