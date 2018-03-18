  // creates an INVISIBLE clone of an array
  function invisibleClone(arr, av)
  {
	  var clone = av.ds.array([], {
      indexed: true,
	  visible: false,
      center: true
    });
	  for (var i = 0; i < arr.size(); i++)
	  {
		clone.value(i, arr.value(i));
		if (arr.isHighlight(i))
		{
			clone.highlight(i);
		}
	  }
	return clone;
  }

  //replaces one array with another
  function replaceArray(original, replacement, av)
  {
	for (var i = 0; i < original.size(); i++)
	{
		original.value(i, replacement.value(i));
		if (replacement.isHighlight(i))
		{
			original.highlight(i);
		} else {
			original.unhighlight(i);
		}
	}
  }

  // returns the index of the highlighted value if there is one
  function getHighlight(ar)
  {
    for (var i = 0; i < ar.size(); i++)
    {
      if (ar.isHighlight(i))
      {
        return i;
      }
    }
    return -1;
  }

// returns the number of indices with a given class
function countIndWithClass(ar, class_name)
{
	var count = 0;
	for (var i = 0; i < ar.size(); i++)
	{
		if (ar.hasClass(i, class_name))
		{
			count++;
		}
	}
	return count;
}

// returns an array of the indices with a given css class
function getIndicesWithClass(ar, class_name)
{
	var ind = [];
	for (var i = 0; i < ar.size(); i++)
	{
		if (ar.hasClass(i, class_name))
		{
			ind.push(i);
		}
	}
	return ind;
}
