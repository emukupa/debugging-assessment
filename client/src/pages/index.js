import React, { Component } from "react";
import { Layout, Row, Col, Icon } from "antd";
import { Route, Link } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import axios from "axios";
import NoteList from "../components/note_list";
import NoteEditor from "../components/note_editor";
import UserHeader from "../components/user_header";
import AddNoteButton from "../components/note_list_add_note_button";
import "../components/note_editor.css";

const { Content } = Layout;

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      loading: true
    };
  }

  componentDidMount() {
    this.fetchAllNotes();
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props;
    if (nextProps.match !== match) {
      this.fetchAllNotes();
    }
  }

  setLoading(loading) {
    this.setState({
      loading
    });
  }

  setErrors(errors) {
    this.setState({
      errors
    });
  }

  setNotes(notes) {
    this.setState({
      notes
    });
  }

  fetchAllNotes(shouldShowLoadingIndicator = true) {
    this.setLoading(shouldShowLoadingIndicator);
    const { notesType } = this.props;
    const notesUrl = notesType == "all" ? "/notes" : "/notes/recycled";
    axios
      .get(notesUrl)
      .then(response => {
        this.setLoading(false);
        this.setNotes(response.data);
      })
      .catch(error => {
        this.setLoading(false);
        const { response } = error;
        if (response && response.data && response.data.errors) {
          this.setErrors(response.data.errors);
        } else {
          this.setErrors(["Oops. Something went wrong on our end."]);
        }
      });
  }

  createNewNote() {
    const { history } = this.props;
    axios
      .post("/notes", {
        title: "New Note",
        description: "Check the new note!"
      })
      .then(response => {
        this.fetchAllNotes(false);
        history.push("/notes/" + response.data._id);
      })
      .catch(error => {
        const { response } = error;
        if (response && response.data && response.data.errors) {
          this.setErrors(response.data.errors);
        } else {
          this.setErrors(["Oops. Something went wrong on our end."]);
        }
      });
  }

  isNotesTypeAll() {
    const { notesType } = this.props;
    return notesType === "all";
  }

  render() {
    const { notes, loading } = this.state;
    const { history, match } = this.props;
    return (
      <div>
        <Layout
          style={{
            backgroundColor: "#ECECEC",
            height: "100vh"
          }}
        >
          <Content style={{ padding: "5em", paddingTop: "2em" }}>
            <UserHeader />
            <Row>
              <Col xs={6}>
                <Link to="/notes">
                  <h2
                    style={{
                      float: "left",
                      marginLeft: "5px",
                      color: this.isNotesTypeAll() ? "#333" : "#aaa"
                    }}
                  >
                    All Notes
                  </h2>
                </Link>
                <h2
                  style={{
                    float: "left",
                    marginLeft: "1em",
                    color: this.isNotesTypeAll() ? "#aaa" : "#333"
                  }}
                >
                  Recycle Bin
                </h2>
                <AddNoteButton onClick={() => this.createNewNote()} />
                <div style={{ clear: "both" }} />
                <ScrollArea
                  style={{ height: "80vh" }}
                  verticalScrollbarStyle={{ display: "none" }}
                >
                  <NoteList
                    noteClicked={id => history.push(`${match.url}/${id}`)}
                    notes={notes}
                    loading={loading}
                  />
                </ScrollArea>
              </Col>
              <Col offset={1} xs={17}>
                <Route
                  path={`${match.url}/:id`}
                  component={props => (
                    <NoteEditor
                      {...props}
                      noteUpdated={() => this.fetchAllNotes(false)}
                    />
                  )}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}
