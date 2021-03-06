import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";

import Loader from "./Loader";
import MediaHover from "./medias/MediaHover";
import MediaBlock from "./medias/MediaBlock";
import PostButton from "../containers/postbutton";
import Toaster from "../containers/toaster";
import SearchBar from "../containers/searchBar";
import Footer from "../components/Footer";
import Pagination from "../containers/pagination";
import "../scss/app.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.page = 1;
        this.keyDown = this.keyDown.bind(this);
        this.triggerRender = this.triggerRender.bind(this);
        this.state = {
            triggerRender: false
        };
    }

    componentWillMount() {
        this.page = parseInt(new URLSearchParams(window.location.search).get("page") || this.page, 10);
        this.props.getMedias(this.page);
        document.addEventListener("keydown", this.keyDown);
        window.addEventListener("resize", this.triggerRender);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status.redirect) {
            window.history.pushState(null, null, "/");
            this.props.getMedias(1);
        }
    }

    triggerRender() {
        this.setState({
            triggerRender: !this.state.triggerRender
        });
    }  
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDown);
        document.removeEventListener("resize", this.triggerRender);
    }

    keyDown({keyCode}) {
        if (keyCode === 27) {
            this.props.hideExpand();
        }
    }

    renderMedias() {
        return this.props.results.data.map((media, index) => <MediaBlock key={`media${index}`} triggerRender={this.state.triggerRender} index={index} media={media} />);
    }

    getY(el) {
        let yPos = 0;
        while (el) {
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            el = el.offsetParent;
        }
        return yPos;
    }

    render() {
        return (
            <Fragment>
                <div className="wrapper">
                    <SearchBar />
                    <div className={"subWrapper"}>
                        <div className="category">
                            <p><span className={"capitalize"}>{`${this.props.searchRequest.type}`}</span> {`(${this.props.results.total} result${this.props.results.total !== 1 ? "s" : ""})`}</p>
                        </div>
                        <div className={"flexContainer"}>
                            {this.renderMedias()}
                        </div>
                        <Pagination />
                    </div>
                    <Footer />
                    <PostButton showToast={this.props.showToast} />
                </div>
                <MediaHover expand={this.props.expand} hideExpand={this.props.hideExpand} />
                <Loader
                    in={this.props.status.get === "PENDING" || this.props.status.searching === "PENDING"  || this.props.status.post === "PENDING" || this.props.status.delete === "PENDING"}
                    transparent={this.props.status.post === "PENDING" || this.props.status.delete === "PENDING"}
                    hover={true}
                />
                <Toaster />
            </Fragment>
        );
    }
}

App.propTypes = {
    getMedias: PropTypes.func,
    hideExpand: PropTypes.func,
    showToast: PropTypes.func,
};

export default App;
