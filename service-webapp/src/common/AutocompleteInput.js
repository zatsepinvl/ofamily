import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {MenuItem} from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {withStyles} from 'material-ui/styles';

const renderInput = (inputProps) => {
    const {classes, autoFocus, value, ref, margin, ...other} = inputProps;
    return (
        <TextField
            autoFocus={autoFocus}
            className={classes.item}
            value={value}
            inputRef={ref}
            InputProps={{
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
            margin={margin}
        />
    );
};

const renderSuggestionsContainer = (options) => {
    const {containerProps, children} = options;
    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
};

const getSuggestions = (value, suggestions = [], getSuggestionValue) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 5 && getSuggestionValue(suggestion).toLowerCase().slice(0, inputLength) === inputValue;
            if (keep) {
                count += 1;
            }
            return keep;
        });
};

const styles = theme => ({
    container: {
        position: 'relative',
        width: 200,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        display: 'inline-flex'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
        top: 30,
        zIndex: 999,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    item: {
        width: 200,
    },
});

class AutocompleteInput extends React.Component {
    state = {
        value: '',
        suggestions: [],
    };

    handleSuggestionsFetchRequested = ({value}) => {
        const {data, getSuggestionValue} = this.props;
        this.setState({
            suggestions: getSuggestions(value, data, getSuggestionValue),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, {newValue}) => {
        this.setState({
            value: newValue,
        });
    };

    renderSuggestion = (suggestion, {query, isHighlighted}) => {
        const {getSuggestionValue} = this.props;
        const matches = match(getSuggestionValue(suggestion), query);
        const parts = parse(getSuggestionValue(suggestion), matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ?
                            <span key={index} style={{fontWeight: 500}}>
                                 {part.text}
                            </span>
                            :
                            <strong key={index} style={{fontWeight: 300}}>
                                {part.text}
                            </strong>
                    })}
                </div>
            </MenuItem>
        );
    };

    handleSelection = (event, {suggestion}) => {
        this.props.onSelected(suggestion);
    };

    render() {
        const {value} = this.state;
        const {classes, placeHolder, getSuggestionValue, margin, autoFocus} = this.props;
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                onSuggestionSelected={this.handleSelection}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                    autoFocus,
                    classes,
                    placeholder: placeHolder,
                    value,
                    onChange: this.handleChange,
                    margin,
                }}
            />
        );
    }
}

AutocompleteInput.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string
        })
    ),
    placeHolder: PropTypes.string,
    onSelected: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    margin: PropTypes.string,
    autoFocus: PropTypes.bool,
};

AutocompleteInput.defaultProps = {
    handleChoice: () => {
    }
};

export default withStyles(styles)(AutocompleteInput);